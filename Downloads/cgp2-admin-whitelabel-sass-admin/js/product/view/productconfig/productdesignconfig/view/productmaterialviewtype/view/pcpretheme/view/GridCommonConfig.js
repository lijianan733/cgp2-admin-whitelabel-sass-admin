/**
 * Created by nan on 2021/10/18
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.view.GridCommonConfig', {
    extend: 'Ext.Base',
    tbar: {
        btnDelete: {
            hidden: false,
            iconCls: 'icon_config',
            width: 150,
            allowLock:false,//是否允许通过锁定机制控制该按钮
            text: i18n.getKey('配置MVT默认主题'),
            handler: function (btn) {
                var grid = btn.ownerCt.ownerCt;
                var tab = grid.ownerCt;
                var newPanel = tab.getComponent('defaultThemeExpression');
                if (Ext.isEmpty(newPanel)) {
                    newPanel = tab.add({
                        xtype: 'defaultthemegridpanel',
                        pcsData: grid.pcsData,
                        closable: true,
                        itemId: 'defaultThemeExpression',
                        mvtType: grid.mvtType,
                        title: i18n.getKey('MVT默认主题'),
                        mvtId: grid.mvtId,
                    });
                }
                tab.setActiveTab(newPanel);
            }
        }
    },
})