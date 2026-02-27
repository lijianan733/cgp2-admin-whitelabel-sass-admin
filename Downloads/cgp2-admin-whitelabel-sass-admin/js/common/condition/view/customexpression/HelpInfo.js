/**
 * @Description:
 * @author nan
 * @date 2023/10/18
 */
Ext.define('CGP.common.condition.view.customexpression.HelpInfo', {
    extend: 'Ext.panel.Panel',
    closable: true,
    alias: 'widget.helpinfo',
    flex: 1,
    layout: {
        type: 'vbox'
    },
    autoScroll: true,
    defaults: {
        margin: '5 25 5 25'
    },
    collapsible: true,
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'component',
                html: '<strong>标准格式：</strong>'
            },
            {
                xtype: 'container',
                html: "<div>\n" +
                    "    <pre>\n" +
                    "        function expression(args) {\n" +
                    "            if (上下文变量 >'值') {\n" +
                    "                return true;\n" +
                    "            } else if (上下文变量 <'值2') {\n" +
                    "                return false;\n" +
                    "            } else {\n" +
                    "                return false;\n" +
                    "            }\n" +
                    "        }\n" +
                    "   </pre>\n" +
                    "</div>"
            },
            {
                xtype: 'component',
                html: '<strong>可选操作符</strong>'
            },
            {
                xtype: 'container',
                autoEl: 'div',
                width: 800,
                height: 600,
                html: '<img src="' + location.origin + '/file/static/nantest/可选操作符.png' + '">'
            },
            {
                xtype: 'component',
                html: '<strong>属性选项</strong>'
            },
            {
                xtype: 'container',
                autoEl: 'div',
                width: 800,
                height: 600,
                html: '<img src="' + location.origin + '/file/static/nantest/属性选项.png' + '">'
            },
            {
                xtype: 'component',
                html: '<strong>属性详情</strong>'
            },
            {
                xtype: 'container',
                autoEl: 'div',
                width: 800,
                height: 600,
                html: '<img src="' + location.origin + '/file/static/nantest/属性详情.png' + '">'
            },
            {
                xtype: 'component',
                html: '<strong>示例模板</strong>'
            },
            {
                xtype: 'container',
                autoEl: 'div',
                width: 800,
                height: 600,
                html: '<img src="' + location.origin + '/file/static/nantest/示例模板.png' + '">'
            },

            {
                xtype: 'component',
                html: '<strong>插入数据:点击插入图标</strong>'
            },
            {
                xtype: 'container',
                autoEl: 'div',
                width: 1000,
                height: 400,
                html: '<img src="' + location.origin + '/file/static/nantest/微信截图_20231018175138.png' + '">'
            },
            {
                xtype: 'component',
                html: '<strong>指定内容替换选中文本</strong>',
            },
            {
                xtype: 'container',
                autoEl: 'div',
                width: 800,
                height: 600,
                html: '<img src="' + location.origin + '/file/static/nantest/文本选中.png' + '">'
            },
            {
                xtype: 'component',
                html: '<strong>指定内容插入到鼠标光标处</strong>'
            },
            {
                xtype: 'container',
                autoEl: 'div',
                width: 800,
                height: 600,
                html: '<img src="' + location.origin + '/file/static/nantest/文本插入.png' + '">'
            },
        ];
        me.callParent();
    }
})