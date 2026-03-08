const { TEMPLATES } = require('../../src/utils/documentTemplates');

describe('documentTemplates', () => {
    it('should be an array of templates', () => {
        expect(Array.isArray(TEMPLATES)).toBe(true);
        expect(TEMPLATES.length).toBeGreaterThan(0);
    });

    describe('Each Template Structure', () => {
        TEMPLATES.forEach((template) => {
            it(`template ${template.id} should have all required properties`, () => {
                expect(template).toHaveProperty('id');
                expect(template).toHaveProperty('name');
                expect(template).toHaveProperty('description');
                expect(template).toHaveProperty('requirements');
                expect(template).toHaveProperty('fields');
                expect(template).toHaveProperty('content');

                expect(typeof template.id).toBe('string');
                expect(typeof template.name).toBe('string');
                expect(typeof template.description).toBe('string');
                expect(typeof template.content).toBe('string');
            });

            it(`template ${template.id} requirements should be valid`, () => {
                expect(template.requirements).toHaveProperty('stampPaper');
                expect(template.requirements).toHaveProperty('notaryRequired');
                expect(template.requirements).toHaveProperty('witnesses');

                expect(typeof template.requirements.stampPaper).toBe('string');
                expect(typeof template.requirements.notaryRequired).toBe('boolean');
                expect(typeof template.requirements.witnesses).toBe('number');
            });

            it(`template ${template.id} fields should be an array of objects`, () => {
                expect(Array.isArray(template.fields)).toBe(true);

                template.fields.forEach((field) => {
                    expect(field).toHaveProperty('key');
                    expect(field).toHaveProperty('label');
                    expect(field).toHaveProperty('type');

                    expect(typeof field.key).toBe('string');
                    expect(typeof field.label).toBe('string');
                    expect(typeof field.type).toBe('string');
                });
            });
        });
    });
});
