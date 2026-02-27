/**
 * Created by nan on 2021/7/14
 */
Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.store.TemplateGroupStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.model.TemplateGroupModel',
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productConfigDesigns/{viewConfigId}/templates',
        reader: {
            type: 'json',
            root: 'data'
        },
        //自己处理返回的数据
        getReader: function () {
            var reader = Ext.Object.merge(this.reader, {
                readRecords: function (dataObject) {
                    var result = {
                        records: [],
                        success: true
                    };
                    var records = dataObject.data;
                    var data = {};
                    for (var i = 0; i < records.length; i++) {
                        var recordData = records[i];
                        var templateConfigs = recordData.productMaterialViewTypeTemplateConfigs;
                        for (var j = 0; j < templateConfigs.length; j++) {
                            var templateConfig = templateConfigs[j];
                            if (Ext.isEmpty(templateConfig.groupId)) {
                                //没有groupId的旧配置
                                continue;
                            }
                            if (Ext.isEmpty(data[templateConfig.groupId])) {//
                                var rawData = {
                                    groupId: templateConfig.groupId,
                                    materialPath: recordData.materialPath,
                                    name: recordData.name,
                                    type: recordData.type,
                                    mvtId: recordData.mvtId,
                                    productMaterialViewTypeTemplateConfigs: []
                                };
                                data[templateConfig.groupId] = rawData;
                                data[templateConfig.groupId].productMaterialViewTypeTemplateConfigs.push(templateConfig);
                            } else {
                                data[templateConfig.groupId].productMaterialViewTypeTemplateConfigs.push(templateConfig);
                            }
                        }
                    }
                    for (i in data) {
                        result.records.push(new this.model(data[i]));
                    }
                    console.log(data);
                    result.total = result.count = result.records.length;
                    return new Ext.data.ResultSet(result);
                },
            });
            return reader;
        }
    },
    constructor: function (config) {
        var me = this;
        if (config && config.viewConfigId) {
            me.proxy.url = adminPath + 'api/productConfigDesigns/' + config.viewConfigId + '/templates';
        }
        me.callParent(arguments);
    }
})