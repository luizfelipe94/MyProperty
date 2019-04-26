(() => {
    console.log("testing request class.");
    const Request = require('../helper/request');
    const options = {
        method: "get",
        uri: "https://www.novaepoca.com.br/prontos/?finalidade=prontos&localizacao=Meier&ValorMin=0&ValorMax=5.000.000%2B&AreaMin=0&AreaMax=6.000%2B"
    }

    Request.get(options.uri, res => console.log(res ));
})();