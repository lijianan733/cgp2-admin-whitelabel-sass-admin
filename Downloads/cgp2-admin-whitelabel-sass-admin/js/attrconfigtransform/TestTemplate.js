Ext.define("CGP.attrconfigtransform.TestTemplate", {
    functionA: function () {
        var data = [
            {
                skuAttribute: {
                    name: 'aaa',
                    id: 123
                },
                propertyName: 'value',
                value: {
                    clazz: 'FixValue',
                    value: '125'
                }
            },{
                skuAttribute: {
                    name: 'bbb',
                    id: 124
                },
                propertyName: 'value',
                value: {
                    clazz: 'FixValue',
                    value: '126'
                }
            }
        ];
        var template = new Ext.XTemplate(
            'if(',
            '<tpl for=".">',
            //'{skuAttribute.name}'+' == ' + '{value.value}',
            '<tpl if="xindex != 1">',
            ' && ' + '{skuAttribute.name}'+' == ' + '{value.value}',
            '<tpl else>',
            '{skuAttribute.name}'+' == ' + '{value.value}',
            '</tpl>',
            '</tpl>',
            ')'
            ).apply(data);
        console.log(template);
        return template;
    }

});