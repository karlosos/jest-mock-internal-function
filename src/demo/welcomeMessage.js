import { getData } from "./utils"

export const WelcomeMessage = ({name}) => {
    return getData(name)
}