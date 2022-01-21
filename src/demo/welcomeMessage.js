import { getData } from "./utils"

export const WelcomeMessage = ({name}) => {
    console.log('>> getData', getData)
    return getData(name)
}