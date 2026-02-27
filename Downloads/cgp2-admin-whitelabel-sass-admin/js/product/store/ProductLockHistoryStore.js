/**
 * Created by nan on 2021/7/20
 */

Ext.define('CGP.product.store.ProductLockHistoryStore', {
    extend: 'Ext.data.Store',
    fields: [
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.product.lock.LockHistory'
        }, {
            name: 'operatorDate',
            type: 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        }, {
            name: 'userId',
            type: 'string',
        },
        {
            name: 'lockStatus',
            type: 'boolean',
        }
    ],
    autoLoad: true,
    constructor: function (config) {
        var me = this;
        if (config.productId) {
            me.proxy = {
                type: 'uxrest',
                url: adminPath + 'api/productlockconfigs/' + config.productId,
                reader: {
                    type: 'json',
                    root: 'data'
                },
                getReader: function () {
                    var reader = Ext.Object.merge(this.reader, {
                        readRecords: function (dataObject) {
                            var result = {
                                records: [],
                                success: true
                            };
                            var lockHistories = dataObject.data.lockHistories;
                            for (var i = 0; i < lockHistories.length; i++) {
                                result.records.push(new this.model(lockHistories[i]));
                            }
                            result.total = result.count = result.records.length;
                            return new Ext.data.ResultSet(result);
                        },
                    });
                    return reader;
                },
            };
        }
        me.callParent(arguments);
    }

})