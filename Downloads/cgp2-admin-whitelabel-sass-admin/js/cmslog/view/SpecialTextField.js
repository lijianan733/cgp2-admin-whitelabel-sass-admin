/**
 * @Description:带禁用启用功能
 * @author nan
 * @date 2023/5/26
 */
Ext.define('CGP.cmslog.view.SpecialTextField', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.special_textfield',
    layout: 'hbox',
    labelAlign: 'left',
    defaults: {},
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'textarea',
                flex: 1,
                readOnly: true,
                fieldStyle: 'background-color:silver',
            },
            {
                xtype: 'button',
                margin: '0 0 0 5',
                width: 80,
                iconCls: 'icon_edit',
                text: i18n.getKey('启用编辑'),
                count: 0,
                handler: function (btn) {
                    var container = btn.ownerCt;
                    var field = container.items.items[0];
                    if (btn.count % 2 == 0) {
                        field.setReadOnly(false);
                        field.setFieldStyle('background-color:white');
                        btn.setText(i18n.getKey('禁用编辑'));
                    } else {
                        field.setReadOnly(true);
                        field.setFieldStyle('background-color:silver');
                        btn.setText(i18n.getKey('启用编辑'));
                    }
                    btn.count++;
                }
            }
        ];
        me.callParent();
    },
    diyGetValue: function () {
        var me = this;
        return me.items.items[0].getValue();
    },
    diySetValue: function (data) {
        var me = this;
        return me.items.items[0].setValue(data);
    }
})
