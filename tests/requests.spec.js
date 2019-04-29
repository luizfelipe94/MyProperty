(async () => {

    process.env.https_proxy = "http://127.0.0.1:8888";
    process.env.http_proxy = "http://127.0.0.1:8888";
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    console.log("testing request class.");
    const Request = require('../helper/request');

    // teste requests 
    const options = {
        url: "https://www.novaepoca.com.br/prontos/?finalidade=prontos&localizacao=Meier&ValorMin=0&ValorMax=5.000.000%2B&AreaMin=0&AreaMax=6.000%2B",
        method: "get"
    };

    const html = await Request.req(options);
    console.log(html);
    
    // teste cookies
    const testCookies = (cookies) => {
        Request.formatCookies(cookies);
    }

    const cookies = {
        "cookie1": "cookie1-abc-def",
        "cookie2": "cookie2-abc-def",
        "cookie3": "cookie3-abc-def",
    }

    testCookies(cookies);
})();

