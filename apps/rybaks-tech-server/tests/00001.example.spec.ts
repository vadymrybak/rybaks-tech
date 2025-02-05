import { expect } from 'chai';
import {
  suite,
  test,
  parallel,
  ContentType,
  Severity,
  allure,
  description,
  epic,
  feature,
  issue,
  owner,
  severity,
  story,
  tag,
  testCaseId,
  Context,
} from '@biorate/mocha';
import { Spec } from './common/spec';
import { Scenario1, Scenario2 } from './scenarios';
import { TestSchema, ScenariosSchema, isString, isBoolean, isTupl } from './schemas';

@suite('Example')
@parallel(false)
class Example extends Spec {
  protected static async after() {
    allure.attachment('Test attachment', 'test attachment content', ContentType.TEXT);
  }

  @issue('1')
  @testCaseId('1')
  @severity(Severity.MINOR)
  @epic('HTTP API tests')
  @feature('Readiness')
  @story('Probe')
  @owner('60000000')
  @tag('api')
  @description('Readiness probe test.')
  @test('/probe/readiness (GET)')
  protected async probeReadiness() {
    await this.validate({
      schema: isString,
      data: await this.supertest.get('/probe/readiness').expect(200),
      field: 'text',
    });
  }

  @issue('2')
  @testCaseId('2')
  @severity(Severity.MINOR)
  @epic('HTTP API tests')
  @feature('Healthz')
  @story('Probe')
  @owner('60000000')
  @tag('api')
  @description('Healthz probe test.')
  @test('/probe/healthz (GET)')
  protected async probeHealthz() {
    await this.validate({
      schema: isString,
      data: await this.supertest.get('/probe/healthz').expect(200),
      field: 'text',
    });
  }

  @issue('3')
  @testCaseId('3')
  @severity(Severity.MINOR)
  @epic('Mock test')
  @feature('Mock')
  @story('Test')
  @owner('60000000')
  @tag('test')
  @description('Mocks test.')
  @test('Test class mock')
  protected mocks() {
    expect(this.root.test.echo()).to.equal('hello world!');
  }

  @issue('4')
  @testCaseId('4')
  @severity(Severity.MINOR)
  @epic('Unit tests 1')
  @feature('Unit 1')
  @story('Tests 1')
  @owner('60000000')
  @tag('unit')
  @description('Unit test 1.')
  @test('Unit test 1')
  protected async mutate1() {
    await this.unit({
      context: this.root.test,
      method: 'mutate',
      ext: 'ts',
      expects: {
        context: ['inc', 'dec'],
        args: true,
        return: true,
      },
    });
  }

  @issue('5')
  @testCaseId('5')
  @severity(Severity.MINOR)
  @epic('Unit tests 2')
  @feature('Unit 2')
  @story('Tests 2')
  @owner('60000000')
  @tag('unit')
  @description('Unit test 2.')
  @test('Unit test 2')
  protected async mutate2() {
    await this.unit({
      context: this.root.test,
      method: 'mutate',
      id: 'mutate2',
      expects: {
        context: true,
        args: true,
        return: true,
      },
    });
  }

  @issue('6')
  @testCaseId('6')
  @severity(Severity.MINOR)
  @epic('Unit tests 3')
  @feature('Unit 3')
  @story('Tests 3')
  @owner('60000000')
  @tag('unit')
  @description('Unit test 3.')
  @test('Unit test 3')
  protected async mutate3() {
    await this.unit({
      context: this.root.test,
      method: 'mutate',
      args: [{ inc: 1 }],
      expects: {
        context: true,
        args: true,
        return: true,
      },
    });
  }

  @issue('7')
  @testCaseId('7')
  @severity(Severity.MINOR)
  @epic('Unit tests 4')
  @feature('Unit 4')
  @story('Tests 4')
  @owner('60000000')
  @tag('unit')
  @description('Negative unit test')
  @test('Negative unit test')
  protected async mutate4() {
    await this.unit({
      context: this.root.test,
      method: 'error',
      args: [],
      expects: {
        context: true,
        args: true,
        return: true,
      },
      catch: (e: Error) => e.message.includes('test-error'),
    });
  }

  @issue('8')
  @testCaseId('8')
  @severity(Severity.MINOR)
  @epic('Validation test 1')
  @feature('Validation 1')
  @story('Tests 8')
  @owner('60000000')
  @tag('unit')
  @description('Validation test 1.')
  @test('Validation test 1')
  protected async validation1() {
    await this.validate({
      schema: TestSchema,
      data: { id: '1', type: 1 },
    });
  }

  @issue('9')
  @testCaseId('9')
  @severity(Severity.MINOR)
  @epic('Validation test 2')
  @feature('Validation 2')
  @story('Tests 9')
  @owner('60000000')
  @tag('unit')
  @description('Validation test 2.')
  @test('Validation test 2')
  protected async validation2() {
    await this.validate({
      schema: isBoolean,
      data: true,
    });
  }

  @issue('10')
  @testCaseId('10')
  @severity(Severity.MINOR)
  @epic('Validation test 3')
  @feature('Validation 3')
  @story('Tests 10')
  @owner('60000000')
  @tag('unit')
  @description('Validation test 3.')
  @test('Validation test 3')
  protected async validation3() {
    await this.validate({
      schema: isBoolean,
      data: [true, false, true],
      array: true,
    });
  }

  @issue('11')
  @testCaseId('11')
  @severity(Severity.MINOR)
  @epic('Validation test 4')
  @feature('Validation 4')
  @story('Tests 11')
  @owner('60000000')
  @tag('unit')
  @description('Validation test 4.')
  @test('Validation test 4')
  protected async validation4() {
    await this.validate({
      schema: isTupl,
      data: ['test', 1, true],
    });
  }

  @issue('12')
  @testCaseId('12')
  @severity(Severity.MINOR)
  @epic('Validation test 5')
  @feature('Validation 5')
  @story('Tests 12')
  @owner('60000000')
  @tag('unit')
  @description('Negative validation test')
  @test('Negative validation test')
  protected async validation5() {
    await this.validate({
      schema: isBoolean,
      data: 'test',
      catch: (e: Error) => true,
    });
  }

  @issue('13')
  @testCaseId('13')
  @severity(Severity.MINOR)
  @epic('Context scenario test 1')
  @feature('Context scenario 1')
  @story('Tests 13')
  @owner('60000000')
  @tag('unit')
  @description('Context scenario test')
  @test('Context scenario test')
  protected async scenario1() {
    await this.validate({
      schema: ScenariosSchema,
      data: (await Context.run([Scenario1, Scenario2])).all(),
    });
  }
}
