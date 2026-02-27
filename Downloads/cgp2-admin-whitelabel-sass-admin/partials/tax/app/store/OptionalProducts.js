/**
 * AlternativeProduct
 * @Author: miao
 * @Date: 2021/11/13
 */
 Ext.define('CGP.tax.store.OptionalProducts', {
     extend: 'Ext.data.Store',
     remoteSort: true,
     sorters: [{
         property: '_id',
         direction: 'DESC'
     }],
     /**
      * @cfg {Number} pageSize
      * 每页的记录数
      */
     pageSize:25,
     fields: [
         {
             name: 'id',
             type: 'int',
             useNull: true
         }, 'model', 'name', 'sku',
         'shortDescription', 'description1',
         'description2', 'description3', 'type',
         {
             name: 'status',
             type: 'int'
         }, {
             name: 'dateAvailable',
             type: 'date',
             dateWriteFormat: 'Uu',
             convert: function (value) {
                 return new Date(value);
             }
         }, {
             name: 'salePrice',
             type: 'float'
         }, {
             name: 'weight',
             type: 'float'
         }, {
             name: 'invisible',
             type: 'boolean'
         }, {
             name: 'template',
             type: 'object'
         }, {
             name: 'medias',
             type: 'array'
         }, {
             name: 'attributeValues',
             type: 'array'
         }, {
             name: 'configurableProductId',
             type: 'int'
         }, {
             name: 'skuAttributes',
             type: 'object'
         }, {
             name: 'mainCategory',
             type: 'object'
         }, {
             name: 'subCategories',
             type: 'array'
         }, {
             name: 'customAttributes',
             type: 'array'
         }, {
             name: 'paibanTypeId',
             type: 'int'
         }, {
             name: 'compositeId',
             type: 'string'
         }, {
             name: 'builderType',
             type: 'string'
         }, {
             name: 'priceRules',
             type: 'array'
         }, {
             name: 'isSupportedCMS',
             type: 'string'
         }],
     proxy: {
         type: 'uxrest',
         url: adminPath + "api/productoftax/{categoryId}/optional/products",
         reader: {
             type: 'json',
             root: 'data.content'
         }
     },
     autoLoad: true,
     constructor:function (config){
         var me=this;
         me.proxy.url = adminPath + 'api/productoftax/' + config.categoryId + '/optional/products';
         me.callParent(arguments);
     }
 });