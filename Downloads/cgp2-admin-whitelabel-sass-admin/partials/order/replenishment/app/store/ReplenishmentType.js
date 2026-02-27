Ext.define('CGP.replenishment.store.ReplenishmentType', {
    extend: 'Ext.data.Store',

    fields: ['title', 'value'],
    data: [{
        title: '补运费',
        value: 'A',
    }, {
        title: '补其它费用',
        value: 'B',

    }]

})