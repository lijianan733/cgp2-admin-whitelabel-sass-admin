/**
 * Created by admin on 2019/4/11.
 */
Ext.define("CGP.dssheettemplateconfig.store.SheetTemplateConfig", {
    extend: 'Ext.data.Store',
    requires: ["CGP.dssheettemplateconfig.model.SheetTemplateConfig"],

    model: "CGP.dssheettemplateconfig.model.SheetTemplateConfig",
    /**
     * @cfg {boolean} remoteSort
     * 是否在服务器端排序
     */
    remoteSort: true,
    /**
     * @cfg {Number} pageSize
     * 每页的记录数
     */
    pageSize: 25,
    /**
     * @cfg {Ext.data.Proxy} proxy
     * store proxy
     */
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/dynamicsize/sheettemplates',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    store: [
        {
            property: 'productType',
            direction: 'ASC'
        },
        {
            property: 'index',
            direction: 'ASC'
        }
    ],
    /**
     * @cfg {boolean} autoLoad
     * 是否自动加载
     */
    autoLoad: true
});
