/**
 * @author xiu
 * @date 2023/9/21
 */
Ext.Loader.syncRequire([
    'CGP.builderpage.view.LeftSingleSelectImageAlpha',
    'CGP.builderpage.view.LeftSingleSelectImageSize'
])
Ext.define('CGP.builderpage.view.LeftSingleSelect', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.leftSingleSelect',
    layout: 'vbox',
    name: 'leftSingleSelect',
    itemId: 'leftSingleSelect',
    defaults: {},
    margin: 0,
    minWidth: 400,
    flex: 1,
    parentComp: null,
    diyGetValue: function () {
        var me = this,
            LeftSingleSelectImageAlpha = me.getComponent('LeftSingleSelectImageAlpha');

        return LeftSingleSelectImageAlpha.diyGetValue();
    },
    initComponent: function () {
        const me = this,
            {parentComp} = me,
            controller = Ext.create('CGP.builderpage.controller.Controller');

        me.items = [
            {
                xtype: 'LeftSingleSelectImageAlpha',
                name: 'LeftSingleSelectImageAlpha',
                itemId: 'LeftSingleSelectImageAlpha',
                parentComp: parentComp,
                minWidth: me.minWidth,
                flex: 1,
            },
            {
                xtype: 'LeftSingleSelectImageSize',
                name: 'LeftSingleSelectImageSize',
                itemId: 'LeftSingleSelectImageSize',
                parentComp: parentComp,
                minWidth: me.minWidth,
                flex: 1,
            },
        ];

        me.callParent();
    }
})