import { v4 as uuidv4 } from 'uuid';


const gen_user_id = () => {
    return uuidv4()
}


const set_user_identification = (prefix = "user") => {
    let user_id = `${prefix}-${uuidv4()}`
    console.log("USER ID: ", user_id);

    localStorage.setItem('user_id', user_id)
}

const get_user_identification = () => {
    let user_id = localStorage.getItem('user_id')

    if(!user_id){
        return ""
    }

    return user_id
}



export default {
    gen_user_id,
    set_user_identification,
    get_user_identification
}
