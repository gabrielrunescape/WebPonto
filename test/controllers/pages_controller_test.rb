require 'test_helper'

class PagesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @base_title = "Aplicativo de ponto on-line"
  end

  test "should get home" do
    get pages_home_url
    assert_response :success
    assert_select "title", "WebPonto - #{@base_title}"
  end

  test "should get about" do
    get pages_about_url
    assert_response :success
    assert_select "title", "Sobre - #{@base_title}"
  end

  test "should get contact" do
    get pages_contact_url
    assert_response :success
    assert_select "title", "Contato - #{@base_title}"
  end

end
