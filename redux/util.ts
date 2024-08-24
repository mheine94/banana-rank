export const compareAlphabetically = (stringA : string, stringB: string) =>{
    if(stringA < stringB){
      return -1;
    }
    if(stringB < stringA){
      return 1;
    }
    return 0;
  }