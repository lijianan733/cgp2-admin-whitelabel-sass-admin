Ext.define('CGP.cmsconfig.store.productAttributeStore', {
    extend: 'Ext.data.Store',
    requires: [
        'CGP.attribute.model.Attribute'
    ],
    model: 'CGP.attribute.model.Attribute',
    proxy: {
        type: 'memory'
    },
    autoLoad: true,
    params: null,
/*    proxy: {
        type: 'uxrest',
        url: '',
        reader: {
            type: 'json',
            root: 'data'
        },
        //自己处理返回的数据,取attribute
        getReader: function () {
            var reader = Ext.Object.merge(this.reader, {
                readRecords: function (dataObject) {
                    var me = this;
                    var result = {
                        records: [],
                        success: true
                    };
                    var records = dataObject.data;
                    var data = {};
                    records.map(function (item) {
                        result.records.push(new me.model(item.attribute));
                    })
                    console.log(data);
                    result.total = result.count = result.records.length;
                    return new Ext.data.ResultSet(result);
                },
            });
            return reader;
        }
    },
    params: null,
    autoLoad: false,
    pageSize: 100,
    groupField: 'isSku',
    constructor: function (config) {
        var me = this;
        me.proxy.url = adminPath + 'api/products/configurable/' + config.productId + '/skuAttributes';
        me.callParent(arguments);
    }*/
})

