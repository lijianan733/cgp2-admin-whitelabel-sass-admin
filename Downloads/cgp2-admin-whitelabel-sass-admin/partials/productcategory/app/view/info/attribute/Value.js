Ext.define('CGP.productcategory.view.info.attribute.Value', {

    extend: 'Ext.window.Window',
    alias: 'widget.attributevalue',
    mixins: ['Ext.ux.util.ResourceInit'],



    layout: {
        type: 'table',
        columns: 1
    },
    frame: false,
    autoScroll : true,
    minWidth: 500,
    height: 350,
    defaults: {
        width: 200
    },
	modal : true,
    bodyStyle: {
        padding: '10px',
        paddingTop: '20px'
    },

    closeAction: 'destroy',

    initComponent: function () {

        var me = this;
        if (!me.record) {
            throw new Error('me.record is not defined');
        }



        me.title = i18n.getKey('attributeValue') + ':' + me.record.get('name');

        me.bbar = [{
            xtype: 'button',
            text: i18n.getKey('ok'),
            action: 'confirmvalue'
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function () {
                me.close();
            }
        }];


        me.items = me.getField(me.record);


        me.callParent(arguments);

    },

    onRender: function () {

        var me = this;
        me.callParent(arguments);
        //增加鼠标enter事件  当点击enter时 于点击ok按钮是一样的效果
        me.el.on('keydown', function (event, target) {
            if (event.button == 12) {
                var button = Ext.ComponentQuery.query('button[action=confirmvalue]', me)[0];
                if (button) {
                    button.fireEvent('click', button);
                }
            }
        }, me);
    },

    refreshItems: function (record) {

        var me = this;

        me.id = record.get('id');

        me.removeAll();
        me.add(me.getField(record));
        me.setTitle(i18n.getKey('attributeValue') + ':' + record.get('name'));

    },

    getField: function (record) {
        var me = this;


        var valueField = Qpp.CGP.util.createColumnByAttribute(record);
        if (valueField.xtype == 'textfield' || valueField.xtype == 'numberfield' || valueField.xtype == 'datefield') {
            var sortOrderWidth = valueField.width;
        }
        valueField.itemId = 'value';
        //        valueField.width = me.defaults.width;
        valueField.itemId = 'value';
        return [valueField, {
            xtype: 'numberfield',
            value: record.get('sortOrder'),
            fieldLabel: i18n.getKey('sortOrder'),
            itemId: 'sortOrder',
            hideTrigger: true,
            width: sortOrderWidth || me.defaults.width,
            allowBlank: false
        }]


    }


})