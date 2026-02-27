/**
 * Created by nan on 2018/5/21.
 */
Ext.syncRequire(['CGP.userdesigncategory.model.UserDesignCategoryModel']);
Ext.define('CGP.userdesigncategory.store.UserDesignCategoryStore', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    model: 'CGP.userdesigncategory.model.UserDesignCategoryModel',
    constructor: function (config) {
        this.proxy = {
            type: 'uxrest',
            url: adminPath + 'api/userDesignCategory/findAll',
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