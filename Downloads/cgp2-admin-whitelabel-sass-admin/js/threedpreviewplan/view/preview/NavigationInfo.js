/**
 *详细页
 **/
Ext.define('CGP.threedpreviewplan.view.preview.NavigationInfo', {
    extend: 'Ext.form.Panel',
    /*padding: 30,
    defaultType: 'textfield',
    defaults: {
        width: 450
    },*/
    //bodyStyle: 'border-top:0;border-color:white;',
    //itemId: 'baseInfo',
    /*layout: {
        type: 'table',
        columns: 1
    },*/
    padding: 10,
    //layout: 'fit',
    initComponent: function () {
        var me = this;
        me.items = [];

        me.title = i18n.getKey('navigation');

        me.callParent(arguments);

    },
    getValue: function () {
        var me = this;
        var result = [];
        //var views = me.getComponent('views').getValue();
        return result;
    },
    setValue: function (data) {
        var me = this;
        me.removeAll();
        me.addItems(data);
        var items = me.items.items;
        Ext.Array.each(items,function(item){
            item.setValue(item.data);
        })
    },
    addItems: function (data) {
        var me = this;
        Ext.Array.each(data, function (tmp,index) {
            var item = {
                xtype: 'uxfieldset',
                data: tmp,
                collapsible: false,
                profileStore: null,//所有能使用的profile,若没有则隐藏
                style: {
                    borderRadius: '10px'
                },
                title: "<font style= ' color:green;font-weight: bold'>" + index + '</font>',
                defaults: {
                    width: 500
                },
                items: [
                    {
                        xtype: 'numberfield',
                        name: 'x',
                        itemId: 'x',
                        fieldLabel: i18n.getKey('x')
                    }, {
                        xtype: 'numberfield',
                        name: 'y',
                        itemId: 'y',
                        fieldLabel: i18n.getKey('y')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'z',
                        itemId: 'z',
                        fieldLabel: i18n.getKey('z')
                    },
                    {
                        name: 'icon',
                        xtype: 'hidden',
                        itemId: 'icon',
                        listeners: {
                            change: function (hidden, newValue) {
                                var url, html;
                                if (newValue != null && newValue != '') {
                                    if (newValue.indexOf(":") == -1) {
                                        url = imageServer + newValue + "/20/20/png";
                                        //html = '<img src="' + url + '" />';
                                        var wrappedImage = hidden.ownerCt.getComponent('browseImage');
                                        if (wrappedImage == null) {
                                            wrappedImage = Ext.create('Ext.form.field.Display', {
                                                fieldLabel: i18n.getKey('languageImgText') + ':',
                                                width: 300,
                                                itemId: 'browseImage',
                                                value: '<img src="' + url + '" />',
                                                style: {
                                                    marginLeft: 45
                                                }
                                                //
                                            });
                                            hidden.ownerCt.insert(5, wrappedImage);

                                        } else {
                                            wrappedImage.setValue('<img src="' + url + '" />');
                                        }

                                    } else {
                                        var wrappedImage = hidden.ownerCt.getComponent('browseImage');
                                        if (wrappedImage != null) {
                                            wrappedImage.disabled();
                                        }
                                    }
                                }
                            }
                        }
                    }]
            };
            me.add(item);
        });

    }


});
