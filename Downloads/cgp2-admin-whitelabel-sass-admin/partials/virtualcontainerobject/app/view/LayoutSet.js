Ext.define('CGP.virtualcontainerobject.view.LayoutSet',{
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.layoutset',

    layout: {
        type: 'table',
        columns: 2
    },
    defaults: {
        flex: 1,
        labelWidth: 25,
        value: 20,
        allowBlank: false,
        margin: '5 5 5 25'
    },
    items: [
        {
            xtype: 'numberfield',
            name: 'top',
            itemId: 'top',
            fieldLabel: i18n.getKey('top')
        },
        {
            xtype: 'numberfield',
            name: 'bottom',
            itemId: 'bottom',
            fieldLabel: i18n.getKey('bottom')
        },
        {
            xtype: 'numberfield',
            name: 'left',
            itemId: 'left',
            fieldLabel: i18n.getKey('left')
        },
        {
            xtype: 'numberfield',
            name: 'right',
            itemId: 'right',
            fieldLabel: i18n.getKey('right')
        },
    ],
    extraButtons: {
        info: {
            xtype: 'displayfield',
            margin: '-2 5 0 5',
            tooltip: '删除配置',
            value: '<div class="iconTipInfo"  data-qtip="该配置是配置单个循环元素的外边距,通过该配置,系统自动算出布局" ></div>',
        }
    },
    getFieldLabel: function () {
        return this.title;
    },
    getErrors: function () {
        return '该输入项为必输项';
    },
    diySetValue: function (data) {
        if (data) {
            this.setValue(data.margin);
        }

    },
    diyGetValue: function () {
        return {
            clazz: 'com.qpp.cgp.domain.pcresource.virtualcontainer.PCLayout',
            margin: this.getValue()
        }
    }

})