Ext.onReady(function () {


    var store = Ext.create('CGP.configuration.store.ConfigStore');
    // 按钮 button
    var tbar = Ext.create('Ext.toolbar.Toolbar', {
        items: [
            {
                itemId: 'btnSave', text: i18n.getKey('Save'),
                iconCls: 'icon_save', handler: modify,
                style: {
                    marginLeft: '15px'
                }
            },
            '-',
            {itemId: 'btnReset', text: i18n.getKey('reset'),
                iconCls: 'icon_reset', handler: reset}
        ]
    });
    var page = Ext.create("Ext.form.Panel", {
        title: i18n.getKey('shipping'),
        height: 400,
        width: 500,
        region: 'center',
        frame: false,
        defaults: {
            msgTarget: 'side',
            style: {
                marginTop: '5px',
                marginLeft: '20px'
            }
        },
        tbar: tbar,
        layout: {
            type: 'table',
            columns: 1
        },
        items: [
//			{
//			colspan : 2,
//			xtype : 'label',
//			html : '<div style="height:50px;line-height:50px;margin-left:20px;' +
//					'font-size:18px;">'+ getQueryString("website") +': Shipping param config</div>'
//		}
        ]
    });

    // 下面两个方法是按钮触发的保存和重置方法
    function modify() {
        var values = Ext.Object.getValues(page.getValues());
        var fields = page.getForm().getFields().items;
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var record = store.getAt(field.itemId);
            if (field.getValue() != record.get('value').toString()) {
                record.set('value',field.getValue().toString());
                record.save();
                record.commit();
            }
        }
        store.sync();
        Ext.MessageBox.alert(i18n.getKey('prompt'), i18n.getKey('savesuccess') + '!');
    }

    function reset() {
        var values = [];
        for (var i = 0; i < (store.getCount()); i++) {
            var conf = store.getAt(i);
            id = conf.get('id');
            value = conf.get('value');
            values.push({
                id: id,
                value: value
            });
        }
        page.getForm().setValues(values);
    }


    // JS的去url的参数的方法，用来页面间传参
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    store.load({
        params: {groupId: 22, website: '' + getQueryString("website") + ''},
        callback: function (records, options, success) {

            for (var i = 0; i < records.length; i++) {
                var fieldtext= new Ext.form.field.Text({
                    fieldLabel: records[i].get('title'),
                    allowBlank: false,
                    width:350,
                    blankText:'this value is required',
                    value: records[i].get('value'),
                    name: records[i].get('id'),
                    itemId: i
                });
                page.add(fieldtext);
            }
        }
    });


    new Ext.container.Viewport({
        layout: 'border',
        renderTo: 'jie',
        items: [ page ]
    });
});











