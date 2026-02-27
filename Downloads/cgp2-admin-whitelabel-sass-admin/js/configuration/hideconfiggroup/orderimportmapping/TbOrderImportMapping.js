Ext.onReady(function () {


    var store = Ext.create('CGP.configuration.store.ConfigStore');
    var orderStatus = Ext.create('CGP.common.store.OrderStatuses');
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
        header: false,
        height: 400,
        width: 500,
        style:'border-width:0 0 0 0;',
        autoScroll: true,
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
        Ext.MessageBox.alert(i18n.getKey('prompt'), i18n.getKey('savesuccess'));
    }

    function reset() {
        var values = [];
        for (var i = 0; i < (store.getCount()); i++) {
            var conf = store.getAt(i);
            id = conf.get('id');
            value = conf.get('value');
            if(conf.data.key == 'TB_CONFIG_KEY_ORDER_IMPORT_INIT_STATUS'){
                var model = orderStatus.getById(parseInt(value));
                var orderStatusCombo = page.getComponent(i);
                orderStatusCombo.setValue(parseInt(value))
                orderStatusCombo.setRawValue(model.get('name'));
            }else{
                values.push({
                    id: id,
                    value: value
                });
            }
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
    //通过配置的 proxy 加载数据到Store 中. 使用 Proxy 来执行异步调用,不关心具体的Proxy是什么类型, 自动添加获得的实例到 Store 中,如有需要,会调用传入的回调函数. 
    store.load({
        params: {groupId: 23, website: '' + getQueryString("website") + ''},
        callback: function (records, options, success) {

           // console.log(records);
            if(!Ext.isEmpty(records)){
            	for (var i = 0; i <records.length; i++) {
                switch (records[i].get('key').split('_')[0]){
                    case 'TB':
                        if(records[i].get('title') == '导入后的状态'){
                            var statusCombo =new Ext.form.field.ComboBox({
                                fieldLabel: records[i].get('title'),
                                allowBlank: false,
                                value: parseInt(records[i].get('value')),
                                name: records[i].get('id'),
                                width:350,
                                itemId: i,
                                editable: false,
                                store: orderStatus,
                                displayField: 'name',
                                valueField: 'id'
                            });
                            page.add(statusCombo);
                        }else{
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
                        break;
                }
            } 	
           }
            
               
            
        }
    });


    new Ext.container.Viewport({
        layout: 'border',
        renderTo: 'jie',
        items: [ page ]
    });
});











