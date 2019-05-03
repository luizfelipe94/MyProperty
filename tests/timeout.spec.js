(async () => {
    for(let i = 0; i < 10; i++){
        setTimeout(async () => {
            console.log("start");
            await teste().then(resp => console.log(resp));
        }, 1000);
    }

    const teste = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("testando");
            }, 1000);
        });
    }
})();