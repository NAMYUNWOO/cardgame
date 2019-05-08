const LocalStrategy = require('passport-local').Strategy;
const bcrypt  =require('bcrypt');

const {User} = require('../models');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField:'code',
        passowrdField:'password',
    }, async (code,password,done) => {
        try {
            const exCode = await User.findOne({where : {code}});
            if (!exCode){
                console.log('가입되지 않은 코드입니다')
                done(null,false,{message:"가입되지 않은 코드입니다."})
            }

            if (exCode.validCode == false){
                console.log('가입 처리 되지 않은 코드입니다')
                done(null,false,{message:"가입 처리 되지 않은 코드입니다."});
            }

            if (exCode) {
                const result = await bcrypt.compare(password,exCode.password);

                if (result){
                    console.log("암호가 일치")
                    done(null,exCode);
                }else{
                    console.log('암호 불일치')
                    done(null,false,{message:"암호가 일치하지 않습니다."});
                }
            }else{
                console.log('가입되지 않은 코드')
                done(null,false,{message:"가입되지 않은 코드입니다."})
            }

        }catch (error){
            console.log("로그인 에러");
            console.error(error);
            done(error);
        }
    }));
};