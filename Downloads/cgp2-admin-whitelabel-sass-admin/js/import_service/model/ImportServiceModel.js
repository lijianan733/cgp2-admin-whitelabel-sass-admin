/**
 * 角色model
 * {
 *     "_id": 256533143,
 *     "clazz": "com.qpp.cgp.domain.importservice.ImportService",
 *     "name": "USImportService",
 *     "code": "USIP",
 *     "calculateStrategy": "PERCENTAGE",
 *     "calculateValue": 30,
 *     "applicationMode": "Stage",
 *     "countryCode": "CN",
 *     "containShippingCalculate": true,
 *     "manufactureCenter": "PL0001",
 *     "shippingMethod": "中通"
 * }
 */
Ext.define('CGP.import_service.model.ImportServiceModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'int',
        useNull: true
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.importservice.ImportService'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'code',
        type: 'string',
    }, {//计算方式  PERCENTAGE为百分比 FIX 固定值
        name: 'calculateStrategy',
        type: 'string'
    }, {//服务费数值
        name: 'calculateValue',
        type: 'string'
    }, {//生效环境 Stage Production
        name: 'applicationMode',
        type: 'string',
    }, {//国家地区code
        name: 'countryCode',
        type: 'string'
    }, {//计算import_service时候是否把运费包含在一起，进行计算
        name: 'containShippingCalculate',
        type: 'boolean'
    }, {//manufactureCenter生产中心
        name: 'manufactureCenter',
        type: 'string',
    }, {//shippingMethod todo 后期处理
        name: 'shippingMethod',
        type: 'string',
        useNull: true,
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/importServices',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});