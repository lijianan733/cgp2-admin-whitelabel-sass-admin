/**
 * @class 自定义工具栏，用于产品查询窗口添加可用按钮
 */
Ext.define('CGP.common.productsearch.bottombar.Bbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.uxproductwintoolbar',
    height: 37,
    buttonText: {
        confirm: 'confirm',
        cancel: 'cancel'
    },

    defaults: {
        width: 70,
        height: 24
    },
    constructor: function (config) {
        var me = this;
        initResource(me.buttonText);
        config = config || {};
        config.btnConfirm = config.btnConfirm || {};
        config.btnCancel = config.btnCancel || {};

        //disabled button
        var disabledButtons = config.disabledButtons || [];

        //hidden button
        var hiddenButtons = config.hiddenButtons || [];

        Ext.applyIf(config.btnConfirm, {
            itemId: 'btnConfirm',
            text: me.buttonText.confirm
        });
        Ext.applyIf(config.btnCancel, {
            itemId: 'btnCancel',
            text: me.buttonText.cancel
        });
        me.callParent([config]);
    },
    initComponent: function (config) {
        var me = this;


        me.items = ['->',me.btnConfirm, me.btnCancel];
        me.callParent(arguments);

        me.buttonConfirm = me.getComponent('btnConfirm');
        me.buttonCancel = me.getComponent('btnCancel');
    }
});