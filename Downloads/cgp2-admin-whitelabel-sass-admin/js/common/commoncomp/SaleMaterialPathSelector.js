/**
 * @Description:销售物料的路径选择器
 * @author nan
 * @date 2024/3/8
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.controller.Controller'
])
Ext.define('CGP.common.commoncomp.SaleMaterialPathSelector', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.sale_material_path_selector',
    layout: 'hbox',
    labelAlign: 'left',
    defaults: {},
    materialPath: null,
    productBomConfigId: null,
    hideChangeMaterialPath: false,
    isValid: function () {
        var me = this;
        var materialPath = me.getComponent('materialPath')
        if (me.disabled == true) {
            return true
        } else {
            if (materialPath.isValid()) {
                return true;
            } else {
                me.Errors[me.getFieldLabel()] = '该输入项为必输项';
                return me.getComponent('materialPath').isValid();
            }
        }
    },
    diySetValue: function (data) {
        var me = this;
        me.getComponent('materialPath').setValue(data);
    },
    diyGetValue: function () {
        var me = this;
        return me.getComponent('materialPath').getValue();
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'textarea',
                itemId: 'materialPath',
                name: 'materialPath',
                margin: '0 5 0 0',
                flex: 1,
                value: me.materialPath,
                readOnly: true,
                allowBlank: false,
                fieldLabel: false,
            },
            {
                xtype: 'button',
                text: i18n.getKey('choice'),
                width: 65,
                hidden: me.hideChangeMaterialPath,
                handler: function (btn) {
                    var component = btn.ownerCt.getComponent('materialPath');
                    var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
                    controller.getMaterialPath(me.productBomConfigId, me.materialPath, component);
                }
            }
        ];
        me.callParent(arguments);
    }
})
