import { url } from "./url"

export const getEntries=()=>{
    return url.get(`/entry`)
}
export const postEntry=(data)=>{
    return url.post('/entry',data)
}
export const deleteEntry=(id)=>{
    return url.delete('/entry/'+id)
}
