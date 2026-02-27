/**
 * @Description:退款申请来源的描述字段
 * db.getCollection('configurations').find({'_id':33779805})
 * @author nan
 * @date 2022/12/5
 */
Ext.define('CGP.orderrefund.store.RefundFromStore', {
    extend: 'Ext.data.Store',
    fields: [
        'value', 'display'
    ],
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        getReader: function () {
            console.log('xxxxxxxxxx');
            var reader = Ext.Object.merge(this.reader, {
                readRecords: function (dataObject) {
                    var me = this;
                    console.log('xxxxxxxxxx');
                    var result = {
                        records: [],
                        success: true
                    };
                    var strData = dataObject.data.value;
                    var arr = Ext.JSON.decode(strData);
                    arr?.map(function (item) {
                        result.records.push(new me.model({
                            value: item,
                            display: item
                        }));
                    });
                    result.total = result.count = arr.length;
                    return new Ext.data.ResultSet(result);
                },
            });
            return reader;
        },
        url: adminPath + 'api/configurations/33774518',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
});