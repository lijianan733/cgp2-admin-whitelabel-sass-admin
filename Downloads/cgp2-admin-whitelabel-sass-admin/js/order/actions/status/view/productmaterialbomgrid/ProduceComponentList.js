Ext.define('Order.status.view.productmaterialbomgrid.ProduceComponentList', {
    extend: 'Ext.form.FieldContainer',
    layout: {
        type: 'column',
        colums: 5
    },
    columns: 5,
    //border: false,
    width: 600,
    minHeight: 24,
    //bodyStyle: 'border:none',
    initComponent: function () {
        var me = this;
        var controller = Ext.create('Order.status.controller.Status');

        var record = me.record;
        var itemId = record.get('id');

        var produceComponentInfos = record.get('produceComponentInfos');
        var materialId = record.get('materialId');
        var detailItems = [];
        Ext.Array.each(produceComponentInfos, function (item) {
            var materialIdComp = {
                xtype: 'displayfield',
                name: item.materialPath,
                width: 80,
                value: '<a href="#" style="color: blue" )>' + item.materialPath.split(',').pop() + '</a>',
                listeners: {
                    render: function (display) {
                        var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                        var ela = Ext.fly(a);//获取到a元素的element封装对象
                        ela.on("click", function () {
                            controller.checkMaterialPath(materialId, item.materialPath)
                        });
                    }
                }
            };
            /*var materialIdComp = {
             xtype: 'textfield',
             name: item.materialPath,
             readOnly: true,
             value: item.materialPath.split(',').pop(),
             width: 80,
             fieldLabel: false
             };*/
            var materialName = {
                xtype: 'textfield',
                name: item.materialName,
                //fieldStyle: 'background-color:silver',
                margin: '0 0 0 10',
                readOnly: true,
                value: item.materialName,
                width: 140,
                fieldLabel: false
            };
            var isNeedPrint = {
                xtype: 'textfield',
                name: item.isNeedPrint,
                //fieldStyle: 'background-color:silver',
                margin: '0 0 0 10',
                readOnly: true,
                value: i18n.getKey(item.isNeedPrint),
                width: 60,
                fieldLabel: false
            };
            var impositionType = {
                xtype: 'textfield',
                name: item.impositionType,
                fieldStyle: Ext.isEmpty(item.impositionType) ? 'background-color:silver' : 'background-color:white',
                margin: '0 0 0 30',
                readOnly: true,
                value: i18n.getKey(item.impositionType),
                width: 80,
                fieldLabel: false
            };
            if (Ext.isEmpty(item.availablePrinters)) {
                item.availablePrinters = [];
            }
            var availablePrinters = Ext.JSON.encode(item.availablePrinters);
            var filter = [{"name":"includeCodes","type":"string","value":availablePrinters}];
            var filterString = JSON.stringify(filter);
            var machineReadOnly = !item.isNeedPrint || (item.machine != 'OTHER' && !Ext.isEmpty(item.machine));
            var machine = {
                xtype: 'combo',
                //matchFieldWidth: false,
                //columnWidth: 140,
                store: Ext.create('Order.status.store.MachineModel', {
                    params: {
                        filter: filterString
                    }}),
                displayField: 'code',
                fieldStyle: !item.isNeedPrint ? 'background-color:silver' : 'background-color:white',
                allowBlank: machineReadOnly,

                //forceSelection: true,
                valueField: 'code',
                readOnly: machineReadOnly,
                listeners: {
                    change: function (comp, newValue, oldValue) {
                        item.printer = newValue;
                        Ext.Ajax.request({
                            method: 'PUT',
                            url: adminPath + 'api/produceComponentInfos/' + item._id + '/printer',
                            jsonData: {
                                printer: newValue
                            },
                            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                            success: function (response, options) {
                                var r = Ext.JSON.decode(response.responseText);
                                if (!r.success) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), r.data.message);
                                    return;
                                }
                            },
                            failure: function (response, options) {
                                var r = Ext.JSON.decode(response.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), r.data.message);
                            }
                        });
                    }
                },
                margin: '0 0 0 10',
                name: item.printer,
                editable: false,
                value: item.printer,
                width: 120,
                fieldLabel: false
            };
            detailItems.push(materialIdComp, materialName, isNeedPrint, impositionType, machine)
        });

        var tbarItems = [];
        me.items = detailItems;
        me.callParent(arguments);
    },
    isValid: function () {
        var me = this;
        var isPrinted = true;
        var comboList = me.query('combo');
        Ext.Array.each(comboList, function (item) {
            if (!item.isValid()) {
                isPrinted = false;
                return false;
            }
        });
        return isPrinted;
    }
});