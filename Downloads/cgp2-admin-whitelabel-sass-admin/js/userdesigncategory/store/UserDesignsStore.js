/**
 * Created by nan on 2018/5/22.
 */
Ext.syncRequire(['CGP.userdesigncategory.model.UserDesignModel']);
Ext.define('CGP.userdesigncategory.store.UserDesignsStore', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    pageSize:25,
    model: 'CGP.userdesigncategory.model.UserDesignModel',
    constructor: function (config) {
        this.proxy = {
            type: 'uxrest',
            url: adminPath + 'api/userdesign/findAll',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            reader: {
                type: 'json',
                root: 'data.content'
            }
        };

        this.callParent(arguments);

    }
})