Ext.define('CGP.common.store.OrderStatuses', {
    extend: 'Ext.data.Store',
    storeId: 'allOrderStatus',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'name',
            type: 'string',
            convert: function (value, record) {
                return i18n.getKey(value);
            }
        },
        {
            name: 'frontendName',
            type: 'string'
        },
        {
            name: 'tipInfo',
            type: 'string',
            convert: function (value, record) {
                return record.get('name') + '(id:' + record.get('id') + ')';
            }
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/whitelabelOrderStatuses',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    pageSize: 1000,
    sorters: [{   //应用于当前Store的排序器集合
        property: 'fontSort',
        direction: 'ASC'
    }],
    listeners: {
        load: function (store, records) {
            this.insert(0, {
                id: null,
                name: i18n.getKey('allStatus')
            });
        }
    },
    autoLoad: true
})