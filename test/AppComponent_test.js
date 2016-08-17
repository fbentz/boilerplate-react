import React from "react";
import { expect } from "chai";
import sinon from "sinon";
import { shallow, mount, render } from "enzyme";

import AppComponents from "../src/js/components";

describe("<AppComponents />", function() {
  it("calls componentDidMount", function() {
    sinon.spy(AppComponents.prototype, 'componentDidMount');
    const wrapper = mount(<AppComponents />);
    expect(AppComponents.prototype.componentDidMount.calledOnce).to.equal(true);
  });
});