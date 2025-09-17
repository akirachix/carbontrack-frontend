const baseUrl = '/api/emissions';
export async function fetchEmissions(){
    try{
        const response = await fetch(baseUrl);
        console.log(response);

        if(!response.ok){
            throw new Error("Something went wrong"+ response.statusText)
        }
        const result = await response.json();
        
           return result;
    }catch(error){
        throw new Error("Failed to fetech users" + (error as Error).message)
    }
}