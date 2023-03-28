
const truncatepost = (desc) =>{
    if(desc.length>200)
    {
        return desc.substring(0,200) + "..."
    }
    else
    {
        return desc
    }
}

module.exports = {
    truncatepost,
}