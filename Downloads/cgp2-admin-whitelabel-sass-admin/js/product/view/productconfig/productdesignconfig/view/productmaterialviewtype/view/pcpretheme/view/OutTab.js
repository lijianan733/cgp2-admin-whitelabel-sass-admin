/**
 * Created by nan on 2021/8/25
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.view.SingleThemeGrid',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.view.MultiThemeGrid',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.view.DefaultThemeGridPanel'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.view.OutTab', {
    extend: 'Ext.tab.Panel',
    mvtId: null,
    pcsData: null,//pcs配置源数据
    contentData: null,//条件组件用的上下文数据
    initComponent: function () {
        var me = this;
        me.items = [

            {
                xtype: 'singlethemegrid',
                pcsData: me.pcsData,
                mvtType: me.mvtType,
                title: i18n.getKey('单预设主题'),
                mvtId: me.mvtId,
            },
            {
                xtype: 'multithemegrid',
                mvtType: me.mvtType,
                mvtId: me.mvtId,
                title: i18n.getKey('多预设主题'),
                pcsData: me.pcsData,
            }
        ];
        me.callParent();
    },
})