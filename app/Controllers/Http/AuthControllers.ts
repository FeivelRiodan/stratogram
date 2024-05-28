import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class AuthController {
    /**
     * async index
     */
    public async signup({request, response}: HttpContextContract) {
        const validator = await request.validate({
            schema:schema.create({
            name: schema.string(),
            email: schema.string({}, [
                rules.email(),
                rules.unique({table : 'users', column: 'email'}),
            ]),
            password: schema.string({}, [
                rules.minLength(8),
                // rules.regex(/^[a-zA-Z0-9!@##$%^&*()-_.,?'"/`~+=|{[<>}]+$/),
                rules.confirmed(),
              ]),
        }),
        messages: {
            'name.required': '*name cannot be empty',
            'email.required': '*email cannot be empty',
            'email.unique': '*account with this email has already existed',
            'password.required': '*password cannot be empty',
            'password.minLength': '*password must at least 8 characters and includes at least 1 UPPERCASE, number, and symbol',
            // 'password.regex': '*password must at least 8 characters and includes at least 1 UPPERCASE, number, and symbol',
            'password_confirmation.confirmed': '*confirmation password must be same',
            }
        })
        console.log(validator);
        const user = new User();
        user.name = validator.name;
        user.email = validator.email;
        user.password = validator.password;
        await user.save();

        // send verification email

        Mail.send((message) => {
            message
            .from('stratogram@adonis.com')
            .to(user.email)
            .subject('Welcome Onboard! But there is one last step.')
            .htmlView('emails/verify', { user })
        })
        


        // console.log(user,$isPersisted)
        return response.redirect('/login')
    }

    public async login({request, auth, response}: HttpContextContract){
        const validator = await request.validate({schema:schema.create({
            email: schema.string({}, [
                rules.email()
            ]),
            password: schema.string({}, [
                // rules.confirmed(),
                // rules.minLength(8),
                // rules.regex(/^[a-zA-Z0-9!@##$%^&*()-_.,?'"/`~+=|{[<>]}]+$/)
              ]),
        }),
        messages: {
            'email.required': '*email cannot be empty',
            'password.required': '*password cannot be empty',
            // 'password.minLength': '*password must be at least 8 characters',
            }
        })

        const email = validator.email
        const password = validator.password
        await auth.attempt(email, password)
        // auth.user
        return response.redirect('/home')
    }

    public async logout({auth,response}:HttpContextContract ){
        await auth.logout;
        return response.redirect('/')
    }

}







