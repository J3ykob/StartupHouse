export default {
    get: (url: string) => {
        if(url === 'https://zombie-items-api.herokuapp.com/api/items'){
            return Promise.resolve({
                data: {
                    items: [
                        {
                            name: 'item1',
                            price: 10,
                            id: 123
                        },
                        {
                            name: 'item2',
                            price: 20,
                            id: 4567
                        }
                    ]
                }
            });
        }else if(url === 'http://api.nbp.pl/api/exchangerates/tables/C/today/'){
            return Promise.resolve({
                data: [
                    {
                        no: '123',
                        effectiveDate: '2019-01-01',
                        rates: [
                            {
                                currency: 'EUR',
                                code: 'EUR',
                                bid: 4.5,
                                ask: 5.5
                            },
                            {
                                currency: 'USD',
                                code: 'USD',
                                bid: 3.5,
                                ask: 4.5
                            }
                        ]
                    }
                ]
            });
        }
    }
}