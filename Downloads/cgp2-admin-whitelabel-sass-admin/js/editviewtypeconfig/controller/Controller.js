/**
 * Created by nan on 2020/7/29.
 */
Ext.define("CGP.editviewtypeconfig.controller.Controller", {
    /**
     * 创建DOT对应的domain
     * @param data
     */
    buildDomain: function (data) {

        var domain = {
            clazz: "com.qpp.cgp.domain.product.config.view.builder.config.EditViewType",
            areas: [],
            _id: data.editViewTypeDomain ? data.editViewTypeDomain._id : JSGetCommonKey(false),
            description: data.description
        };
        var areas = [];
        for (var i = 0; i < data.areas.length; i++) {
            var area = data.areas[i];
            var widthOrHeight = null;
            //widthOrHeight为true表示宽
            if (area.layoutPosition == 'H1' || area.layoutPosition == 'Bottom') {
                widthOrHeight = false;
            } else if (area.layoutPosition == 'Left' || area.layoutPosition == 'Right') {
                widthOrHeight = true;
            } else {
                widthOrHeight = null;
            }
            var components = [];
            for (var j = 0; j < area.components.length; j++) {
                components.push({
                    name: area.components[j].name,
                    area: area.id,
                    id: area.components[j].id,
                    type: area.components[j].type
                })
            }
            console.log(components)
            areas.push({
                id: area.id,
                sizeValue: area.sizeValue,
                widthOrHeight: widthOrHeight,
                components: components,
                editViewType: {
                    _id: domain._id,
                    clazz: 'com.qpp.cgp.domain.product.config.view.builder.config.EditViewType'
                },
                position: {
                    isSingleChild: area.layoutPosition == 'H1',
                    layoutPosition: area.layoutPosition
                },
            })
        }
        domain.areas = areas;
        return domain;
    },
    /**
     * 无解，要报domain转出DOT数据,
     * 这个的意义在哪
     */
    domainToDto: function (editViewType, DTO) {
        var result = {
            _id: DTO ? DTO._id : JSGetCommonKey(false) + '',
            editViewTypeDomain: editViewType,
            description: editViewType.description,
            areas: [],
            clazz: "com.qpp.cgp.domain.product.config.view.builder.dto.EditViewTypeDto"
        };
        var areas = [];
        for (var i = 0; i < editViewType.areas.length; i++) {
            var area = editViewType.areas[i];
            var components = [];
            for (var j = 0; j < area.components.length; j++) {
                var type = area.components[j].type.split('.').pop();
                type = type.split('Component')[0];
                components.push({
                    id: area.components[j].id,
                    name: area.components[j].name,
                    type: type,
                })
            }
            areas.push({
                id: area.id,
                layoutPosition: area.position.layoutPosition,
                sizeValue: area.sizeValue,
                checked: true,
                components: components
            })
        }
        result.areas = areas;
        return result;
    },
    saveEditViewConfig: function (panel, data) {
        var controller = this;
        controller.setIdValue(data);
        data.editViewTypeDomain = controller.buildDomain(data);
        console.log(data);
        var method = 'POST';
        panel.el.mask();
        panel.updateLayout();
        var url = adminPath + 'api/editViewTypeDtos';
        if (panel.createOrEdit == 'edit') {
            method = 'PUT';
            data._id = panel.recordData._id;
            url = adminPath + 'api/editViewTypeDtos/' + panel.recordData._id;
        }
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (response) {
                panel.el.unmask();
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                        panel.recordData = responseMessage.data;
                        panel.createOrEdit = 'edit';
                        panel.setValue(responseMessage.data);
                        var editviewtypeconfig = top.Ext.getCmp('tabs').getComponent('editviewtypeconfig_edit');
                        editviewtypeconfig.setTitle(i18n.getKey('edit') + i18n.getKey('editViewType') + i18n.getKey('config'));
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                panel.el.unmask();
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    },
    /**
     * 为所有空的Id字段赋值
     */
    setIdValue: function (data) {
        var controller = this;
        for (var i in data) {
            if (Object.prototype.toString.call(data[i]) === '[object Array]') {//数组
                for (var j = 0; j < data[i].length; j++) {
                    //数组,//对象
                    if ((typeof (data[i][j]) === 'object')) {
                        controller.setIdValue(data[i][j]);
                    }
                    //普通数据
                }
            } else if (Object.prototype.toString.call(data[i]) === '[object Object]') {
                controller.setIdValue(data[i]);
            } else {
                if (i == 'id' && Ext.isEmpty(data[i])) {
                    data[i] = JSGetCommonKey(false);
                }
            }
        }

    },

});
