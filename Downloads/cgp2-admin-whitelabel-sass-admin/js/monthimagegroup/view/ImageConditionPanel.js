/**
 * Created by nan on 2021/1/30
 */

Ext.define('CGP.monthimagegroup.view.ImageConditionPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.imageconditionpanel',
    closable: true,
    layout: 'vbox',
    rawData: null,//初始的数据
    setValue: function (data) {
        var me = this;
        me.rawData = data;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.diySetValue) {
                item.diySetValue(data[item.getName()]);
            } else if (item.setValue) {
                item.setValue(data[item.getName()]);
            }
        }
    },
    listeners: {
        afterrender: function () {
            var me = this;
            if (me.rawData) {
                me.setValue(me.rawData);
            }
        }
    },
    getValue: function () {
        var me = this;
        var result = {};
        if (me.rendered == true) {
            for (var i = 0; i < me.items.items.length; i++) {
                var item = me.items.items[i];
                if (item.diyGetValue) {
                    result[item.name] = item.diyGetValue();
                } else if (item.getValue) {
                    result[item.name] = item.getValue();
                }
            }
            return result;
        } else {
            return me.rawData;
        }
    },
    initComponent: function () {
        var me = this;
        var store = Ext.create('CGP.common.store.Language');
        me.items = [
            {
                name: 'language',
                xtype: 'gridcombo',
                fieldLabel: i18n.getKey('language'),
                allowBlank: false,
                itemId: 'language',
                displayField: 'name',
                valueField: 'id',
                margin: '10 25 5 25',
                msgTarget: 'side',
                store: store,
                matchFieldWidth: false,
                editable: false,
                multiSelect: false,
                gridCfg: {
                    store: store,
                    height: 280,
                    width: 600,
                    columns: [

                        {
                            text: i18n.getKey('id'),
                            dataIndex: 'id',
                            xtype: 'gridcolumn',
                            itemId: 'id',
                            sortable: true
                        }, {
                            text: i18n.getKey('name'),
                            dataIndex: 'name',
                            xtype: 'gridcolumn',
                            itemId: 'name',
                            sortable: true
                        }, {
                            text: i18n.getKey('locale'),
                            dataIndex: 'locale',
                            xtype: 'gridcolumn',
                            itemId: 'locale',
                            sortable: true,
                            renderer: function (v) {
                                if (v) {
                                    return v.name + '(' + v.code + ')';
                                }
                            }
                        }, {
                            text: i18n.getKey('code'),
                            dataIndex: 'code',
                            xtype: 'gridcolumn',
                            itemId: 'code',
                            sortable: true,
                            renderer: function (v) {
                                return v.code;
                            }
                        }, {
                            text: i18n.getKey('image'),
                            dataIndex: 'image',
                            xtype: 'gridcolumn',
                            minWidth: 120,
                            itemId: 'image',
                            sortable: true,
                            renderer: function (v) {
                                var url = imageServer + v + '/64/64/png';
                                return '<img src="' + url + '" />';
                            }
                        }, {
                            text: i18n.getKey('directory'),
                            dataIndex: 'directory',
                            xtype: 'gridcolumn',
                            itemId: 'directory',
                            sortable: true
                        }, {
                            text: i18n.getKey('sortOrder'),
                            dataIndex: 'sortOrder',
                            xtype: 'gridcolumn',
                            itemId: 'sortOrder',
                            sortable: true
                        }
                    ],
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: store
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setInitialValue([data.id]);
                    }
                },
                diyGetValue: function () {
                    var me = this;
                    var data = me.getArrayValue();
                    if (data) {
                        data = {
                            clazz: 'com.qpp.cgp.domain.common.Language',
                            id: data.id
                        }
                        return data;
                    } else {
                        return null;
                    }
                }
            },
            {
                xtype: 'textfield',
                margin: '10 25 5 25',
                name: 'firstDateOfWeek',
                itemId: 'firstDateOfWeek',
                fieldLabel: i18n.getKey('firstDateOfWeek'),
            },
            {
                xtype: 'textfield',
                margin: '10 25 5 25',
                name: 'clazz',
                itemId: 'clazz',
                hidden: true,
                value: 'com.qpp.cgp.domain.preprocess.holiday.MonthImageCondition',
                fieldLabel: i18n.getKey('clazz'),
            },
            {
                xtype: 'toolbar',
                color: 'black',
                width: '100%',
                colspan: 2,
                bodyStyle: 'border-color:white;',
                border: '0 0 1 0',
                itemId: 'templateConfigToolBar1',
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: false,
                        value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('图片') + '</font>'
                    }
                ]
            },
            {
                xtype: 'imagegroup',
                width: '100%',
                flex: 1,
                name: 'images',
                itemId: 'images',
                bodyStyle: {
                    borderColor: 'silver'
                },
                margin: '10 25 5 25',
            }
        ];
        me.callParent();
    }

})