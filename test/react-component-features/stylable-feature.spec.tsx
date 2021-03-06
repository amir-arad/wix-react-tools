import {reactDecor, stylable} from "../../src";
import {createGenerator} from "stylable";
import {ClientRenderer, expect} from "test-drive-react";
import * as React from "react";
import {inBrowser} from "mocha-plugin-env";
import {runInContext} from "../../src/core/config";
import {devMode} from "../../src/core/dev-mode";


describe.assuming(inBrowser(), 'only in browser')('stylable-react', () => {

    const clientRenderer = new ClientRenderer();
    afterEach(() => runInContext(devMode.OFF, () => clientRenderer.cleanup()));

    const {fromCSS} = createGenerator();
    const {runtime} = fromCSS(`
        .SomeClass {}
    `);

    it('supports empty elements', () => {
        @stylable(runtime)
        class Comp extends React.Component {
            render() {
                return <div data-automation-id="Root">
                    <div data-automation-id="Node"/>
                </div>
            }
        }

        const {select, container} = clientRenderer.render(<Comp> </Comp>);

        expect(select('Root')).to.have.class(runtime.root);
        expect(select('Root')).to.have.attribute('class', runtime.root);


        expect(container.querySelectorAll(`.${runtime.root}`)).to.have.length(1);
    });

    it('supports class names', () => {
        @stylable(runtime)
        class Comp extends React.Component {
            render() {
                return <div data-automation-id="Root">
                    <div data-automation-id="Node" className="SomeClass External"/>
                </div>
            }
        }

        const {select, container} = clientRenderer.render(<Comp> </Comp>);

        expect(select('Root')).to.have.class(runtime.root);
        expect(container.querySelectorAll(`.${runtime.root}`)).to.have.length(1);
        expect(select('Node')).to.have.class(runtime.SomeClass);
        expect(select('Node')).to.have.class('External');
        expect(container.querySelectorAll(`.${runtime.SomeClass}`)).to.have.length(1);
    });

    describe('style state', () => {
        const {fromCSS} = createGenerator();
        const {runtime} = fromCSS(`
            .root {
                -st-state:a,b;
            }
            .SomeClass {
                -st-state:x,y;
            }
        `);

        const rootState = {a: true, b: false};
        const rootStateAttrName = Object.keys(runtime.$stylesheet.cssStates(rootState))[0]; // css.cssStates(...) will only have keys for states which are true
        const nodeState = {x: true, y: false};
        const nodeStateAttrName = Object.keys(runtime.$stylesheet.cssStates(nodeState))[0];

        it('supported', () => {
            @stylable(runtime)
            class Comp extends React.Component {
                render() {
                    return <div data-automation-id="Root" style-state={rootState}>
                        <div data-automation-id="Node" className="SomeClass" style-state={nodeState}/>
                    </div>
                }
            }

            const {select} = clientRenderer.render(<Comp> </Comp>);

            expect(select('Root')).to.have.attribute(rootStateAttrName);
            expect(select('Node')).to.have.attribute(nodeStateAttrName);
            expect(new Comp({}).render().props).to.not.haveOwnProperty('cssState'); // delete original cssStates from render result
            expect(new Comp({}).render().props.children.props).to.not.haveOwnProperty('cssState'); // delete original cssStates from render result

        });

        it('cleans up original property', () => {
            @stylable(runtime)
            class Comp extends React.Component {
                render() {
                    return <div style-state={rootState}/>
                }
            }

            const rootElement = new Comp({}).render();
            expect(rootElement && rootElement.props).to.not.have.property('style-state');
        });
    });

    describe('decoration', () => {
        @stylable(runtime)
        class Comp extends React.Component {
            render() {
                return <div data-automation-id="Root"/>
            }
        }

        it('should return true when checking isDecorated on a component decorated with stylable', () => {
            expect(reactDecor.isDecorated(Comp)).to.equal(true);
            expect(reactDecor.isDecorated(Comp, stylable)).to.equal(true);
        });
    });
});
