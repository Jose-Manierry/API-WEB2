import express, { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import * as yup from "yup";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { verifyToken } from "../middlewares/authMiddleware";
import bcrypt from "bcrypt";

const router = express.Router();



router.post("/", async(req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "E-mail e senha são obrigatórios.",
            });
        }


            const authService = new AuthService();

            const userData = await authService.login(email, password);

            res.status(200).json({
                message: "Usuário autenticado com sucesso.",
                user: userData
             });




    } catch (error: any) {
        res.status(401).json({
             message: error.message || "Erro ao autenticar usuário." 
        });
        return;
    }

});

router.get("/validate-token", verifyToken, async (req: Request, res: Response) => {
    res.status(200).json({
        message: "Token válido.",
        userid: (req as any).user.Id
     });
    
});

router.post("/new-users", async (req: Request, res: Response) => {
    try {

        const data = req.body;

        const schema = yup.object().shape({
            name: yup.string().required("O nome é obrigatório.").min(3, "O nome deve conter no mínimo 3 caracteres."),
            email: yup.string().email("Formato de e-mail inválido.").required("O e-mail é obrigatório."),
            password: yup.string().required("A senha é obrigatória.").min(6, "A senha deve conter no mínimo 6 caracteres."),
            situationId: yup.number().required("A situação é obrigatória.")
        });


        await schema.validate(data, { abortEarly: false });

        const userRepository = AppDataSource.getRepository(User);

        const existingUser = await userRepository.findOneBy({ email: data.email });

        if (existingUser) {
            return res.status(400).json({
                message: "Este e-mail já está cadastrado."
            });
        }

        const userToCreate = userRepository.create(data);
        const newUser = await userRepository.save(userToCreate);
        
        const userResponse = { ...newUser };
        (newUser as any).password = undefined;

        return res.status(201).json({
            message: "Usuário criado com sucesso.",
        });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors
            });
            return;
        }
        res.status(500).json({
            message: "Erro ao criar usuário."
        });
    }
});


    
router.post("/recover-password", async (req: Request, res: Response) => {
    try {
        const data = req.body;

        const schema = yup.object().shape({
            urlRecoverPassword: yup.string().required("A URL de recuperação de senha é obrigatória."),
            email: yup.string().email("Formato de e-mail inválido.").required("O e-mail é obrigatório."),
        });

        await schema.validate(data, { abortEarly: false });

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email: data.email });

        if(!user){
            return res.status(404).json({
                message: "E-mail não encontrado."
            });
        }
/*
          res.status(200).json({
            message: "A chave recuperar senha e valida ",
            
        });
        

          user.recoverPassword = crypto.randomBytes(32).toString("hex");
*/
          user.recoverPassword = crypto.randomBytes(32).toString("hex");
          await userRepository.save(user);

          
          const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: Number(process.env.EMAIL_PORT),
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const message_content = {
                from: process.env.EMAIL_FROM,
                to: data.email,
                subject: 'Recuperar Senha',
                text: `Prezado(a) ${user.name}\n\n
                Informamos que a sua solicitação de senha foi recebida com sucesso.\n\n
                Clique ou copie o link para criar uma nova senha em nosso sistema:
                ${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}\n\n
                Esta mensagem foi enviada a você pela empresa ${process.env.APP}.\n\n
                Você está recebendo porque está cadastrado no banco de dados da empresa ${process.env.APP}.
                Nenhum e-mail enviado pela empresa ${process.env.APP} tem arquivos anexados ou solicita
                o preenchimento de senhas e informações cadastrais.\n\n`,

                html: `Prezado(a) ${user.name}<br><br>
                Informamos que a sua solicitação de alteração de senha foi recebida com sucesso.<br><br>
                Clique no link para criar uma nova senha em nosso sistema:
                <a href="${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}">
                ${data.urlRecoverPassword}
                </a><br><br>
                Esta mensagem foi enviada a você pela empresa ${process.env.APP}.<br><br>
                Você está recebendo porque está cadastrado no banco de dados da empresa ...
                Nenhum e-mail enviado pela empresa ${process.env.APP} tem arquivos anexados ou solicita
                o preenchimento de senhas e informações ...`
            }

            transporter.sendMail(message_content, function(err){
                if(err){
                    console.log("erro ao enviar e-mail", err);
                        res.status(200).json({
                        message: "Erro ao enviar e-mail de recuperação de senha ${process.env.EMAIL_ADM}",
                        });
                        return;
                    }else{
                        res.status(200).json({
                            message: "E-mail de recuperação de senha enviado com sucesso.",
                            urlRecoverPassword: `${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`,
                           
                        });
                        return;
                    }
        
                })



            res.status(200).json({
                message: "E-mail de recuperação de senha enviado com sucesso.",
                urlRecoverPassword: `${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`,
                key: user.recoverPassword,
            });


    } catch (error: any) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors
            });
            return;
        }
        
        
        res.status(500).json({
            message: "Erro ao processar recuperação de senha."
        });
    }

});

router.put("/update-password", async (req: Request, res: Response) => {
    try {
        const data = req.body;

        const schema = yup.object().shape({
            recoverPassword: yup.string().required("A chave de recuperação de senha é obrigatória."),
            email: yup.string().email("Formato de e-mail inválido.").required("O e-mail é obrigatório."),
            password: yup.string().required("A nova senha é obrigatória.").min(6, "A nova senha deve conter no mínimo 6 caracteres.")
        });

        await schema.validate(data, { abortEarly: false });
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email: data.email, recoverPassword: data.recoverPassword });

        if(!user){
            return res.status(404).json({
                message: "A chave de recuperação de senha não é válida."
            });
        }

        user.password = await bcrypt.hash(data.password, 10);
        user.recoverPassword = String(null);

        await userRepository.save(user);

        return res.status(200).json({
            message: "Senha atualizada com sucesso."
        });

    } catch (error: any) {
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({
                message: error.errors
            });
        }
        return res.status(500).json({
            message: "Erro ao processar atualização de senha."
        });
    }
});



export default router;