const { StatusCodes } = require('http-status-codes')

const jwt = require('jsonwebtoken')


//logic  to logged read user id
const auth = async (req,res,next)=>{
    try {
        
        const token = req.header('Authorization')
           jwt.verify(token,process.env.TOKEN_SECRET,(err,user)=>{
            if(err)
                 return res.status(StatusCodes.BAD_REQUEST).json({msg:" Token Required"})

            // res.json({id: user.id})
            req.user = user;
            next() // forwarding Response to next controller

           })


    } catch (err) {
        return res.StatusCodes (StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
    }
}

module.exports = auth;