Ext.define('CGP.model.ProductCategory', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
        name: 'id',
        type: 'int',
        useNull: true
 }, {
        name: 'sortOrder',
        type: 'int'
 }, {
        name: 'invisible',
        type: 'boolean'
 }, {
        name: 'isMain',
        type: 'boolean'
 }, {
        name: 'name',
        type: 'string'
 }, {
        name: 'shortDescription',
        type: 'string'
 }, {
        name: 'description1',
        type: 'string'
 }, {
        name: 'description2',
        type: 'string'
 }, {
        name: 'description3',
        type: 'string'
 }, {
        name: 'parentId',
        type: 'string'
 }, {
        name: 'pageTitle',
        type: 'string'
 }, {
        name: 'pageKeyWords',
        type: 'string'
 }, {
        name: 'pageDescription',
        type: 'string'
 }, {
        name: 'pageUrl',
        type: 'string'
 }, {
        name: 'website',
        type: 'int',
        userNull: 'true'
 }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/productCategory',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});

Ext.define('CGP.model.Website', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int'
    }, 'name']
});

var defaultWebsite = new CGP.model.Website({
    id: 1,
    name: 'PS'
});