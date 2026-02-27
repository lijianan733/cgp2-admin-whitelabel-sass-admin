Ext.define("CGP.rttypes.view.information.BaseInfo", {
    extend: "Ext.form.Panel",
    alias: 'widget.baseinfo',
    padding: 30,
    defaults: {
        width: 450,
        labelAlign: 'left',
        labelWidth: 50
    },
    itemId: 'baseInfo',
    contentData: null,
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('description');
        Ext.apply(Ext.form.VTypes, {
            rtTypeName: function (value) {//验证方法名
                return !(/\s+/.test(value));
            },
            rtTypeNameText: '名称必须不包含空格'
        });
        me.columnCount = 1;
        me.items = [
            {
                xtype: 'textfield',
                readOnly: true,
                itemId: 'id',
                name: '_id',
                fieldStyle: 'background-color:silver',
                fieldLabel: i18n.getKey('id')
            },
            {
                xtype: 'textfield',
                itemId: 'name',
                name: 'name',
                vtype: 'rtTypeName',
                allowBlank: false,
                tipInfo: '不建议使用中文,不能使用空格,不用使用特殊符号',
                emptyText: i18n.getKey('不建议使用中文'),
                fieldLabel: i18n.getKey('name')
            },
            {
                xtype: 'textfield',
                itemId: 'tags',
                name: 'tags',
                fieldLabel: i18n.getKey('tags')
            },
            {
                xtype: 'textfield',
                itemId: 'parentId',
                name: 'parentId',
                hidden: true,
                fieldLabel: i18n.getKey('parentId')
            }
        ];

        me.callParent(arguments);

    },

    refreshData: function (record) {
        var me = this;
        var rtTypeId = record.getId();
        CGP.rttypes.model.RtType.load(rtTypeId, {
            scope: this,
            success: function (rtTypeRecord, operation) {
               
                me.loadRecord(rtTypeRecord);
            },
            failure: function () {

            }
        })
    }

})