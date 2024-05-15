import cron from 'node-cron'
import puppeteer from 'puppeteer';
import { readFileSync } from "fs";

const selectors = JSON.parse(readFileSync('json/ecommerce_scrape.json', {encoding: 'utf8'}));

const data = [
    {
        id: 1,
        email: 'abhinavcv007@gmail.com',
        url: 'https://www.amazon.in/Portable-Desktop-Operation-Personal-Assoretd/dp/B0C2VMP61Q/?_encoding=UTF8&pd_rd_w=c1mat&content-id=amzn1.sym.df161508-a995-4764-931a-cf21efe429b8%3Aamzn1.symc.ecead27c-800a-401e-a631-4760610d717a&pf_rd_p=df161508-a995-4764-931a-cf21efe429b8&pf_rd_r=RZC05VJFPE89FDRJ4HE3&pd_rd_wg=XRDNw&pd_rd_r=f7efbda3-7ccc-402e-9300-a8ef105f0268&ref_=pd_hp_d_atf_ci_mcx_mr_hp_atf_m',
        title: "iQOO Z6 Lite 5G (Stellar Green, 6GB RAM, 128GB Storage) with Charger",
        price: 11999
    },
    {
        id: 2,
        email: 'abhinavcv007@gmail.com',
        url: 'https://www.amazon.in/Centrino-Mens-Black-Loafer-9-9911-01/dp/B094JM3K71/?_encoding=UTF8&pd_rd_w=eWCwv&content-id=amzn1.sym.22a42d01-0089-4fec-a28b-ec7a361d085f%3Aamzn1.symc.acc592a4-4352-4855-9385-357337847763&pf_rd_p=22a42d01-0089-4fec-a28b-ec7a361d085f&pf_rd_r=3B3JZ5D32H9XYM0Y89G7&pd_rd_wg=6F0Zd&pd_rd_r=21ac2970-88be-4015-a4bf-f580e33bcf0d&ref_=pd_gw_ci_mcx_mr_hp_d&th=1&psc=1',
        title: "Centrino Men's 9911-02 Loafer",
        price: 573
    }
]

const AlertCron = async () => {
    try {
        cron.schedule('*/30 * * * * *', async() => {
            data.map(async d => {
                let domain = ''

                if (d.url.includes('amazon')) {
                    domain = 'amazon';
                }
                else if (d.url.includes('ebay')){
                    domain = 'ebay';
                }
                else if (d.url.includes('walmart')){
                    domain = 'walmart';
                }
                else if (d.url.includes('bestbuy')){
                    domain = 'bestbuy';
                }

                const { price: priceSelector } = selectors[domain] || {}

                const browser = await puppeteer.launch({
                    headless: true,
                });
            
                const page = await browser.newPage();
            
                await page.goto(d.url, {
                    waitUntil: "domcontentloaded",
                });

                const newPrice = await page.evaluate((priceSelector) => {
                    const price = document.querySelector(priceSelector)?.innerHTML || 0;

                    return parseInt(price)
                }, priceSelector);


                console.log(newPrice, d.price)
            })
        });
        
    } catch (error) {
        console.log(error)
    }
}

export default AlertCron