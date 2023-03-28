const globalErrHandler = (err,req,res,next)=> {

    const stack = err.stack  
    const message = err.message 
    const status = err.status ? err.stack : "failed" 
    const statuscode = err.statuscode ? err.statuscode : 500 
    // send response 
    res.status(statuscode).json({
        message,
        status , 
        stack
    }); 
}

module.exports = globalErrHandler ; 

