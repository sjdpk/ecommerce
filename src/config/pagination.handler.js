

async function paginationConfig(DbModel,perPageLimit,condn={}){
    const count = await DbModel.count(condn);
    const totalPage = Math.ceil(count/perPageLimit);
    return { totalPage : totalPage, count : count } ;
}


module.exports = paginationConfig;