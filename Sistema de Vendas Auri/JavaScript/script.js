// Número de telefone fixo para o contato no WhatsApp
const FIXED_PHONE_NUMBER = '85997309008'; // Substitua pelo número de telefone desejado (incluindo o código do país e DDD)

// Array para armazenar os itens do carrinho
const cart = [];

// Função para adicionar produtos ao carrinho
function addToCart(productName, productPrice) {
    const product = { name: productName, price: productPrice };
    cart.push(product);
    displayCart();
}

// Função para remover um item do carrinho
function removeFromCart(index) {
    cart.splice(index, 1);
    displayCart();
}

// Função para exibir itens do carrinho
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = ''; // Limpa o conteúdo atual

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - R$ ${item.price.toFixed(2)}`;
        
        // Adiciona o botão de remover
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.onclick = () => removeFromCart(index);
        
        li.appendChild(removeButton);
        cartItems.appendChild(li);
    });
}

// Função para calcular o total dos itens no carrinho
function calculateTotal() {
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    document.getElementById('total').textContent = `Total: R$ ${total.toFixed(2)}`;
    updateTotalWithFee(); // Atualiza o total com a taxa, se selecionado um método de pagamento
}

// Função para atualizar o total com a taxa do método de pagamento selecionado
function updateTotalWithFee() {
    const paymentMethod = document.getElementById('payment-method').value;
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    
    let totalWithFee = total;
    if (paymentMethod === 'credit') {
        totalWithFee = total * 1.05; // 5% de taxa
    } else if (paymentMethod === 'debit') {
        totalWithFee = total * 1.03; // 3% de taxa
    } else {
        totalWithFee = total; // Sem taxa para dinheiro/PIX
    }
    
    document.getElementById('total-with-fee').textContent = `Total com Taxa: R$ ${totalWithFee.toFixed(2)}`;
    validatePaymentMethod(); // Valida se o método de pagamento foi selecionado
}

// Função para validar se o método de pagamento foi selecionado
function validatePaymentMethod() {
    const paymentMethod = document.getElementById('payment-method').value;
    const sendButton = document.getElementById('send-button');
    
    if (!paymentMethod) {
        sendButton.disabled = true;
        return; // Se não selecionado, não habilita o botão de envio
    }
    
    sendButton.disabled = false; // Habilita o botão se um método de pagamento for selecionado
}

// Função para gerar o link e redirecionar para o WhatsApp com a mensagem padrão
function sendMessage() {
    const paymentMethod = document.getElementById('payment-method').value;

    // Valida se o método de pagamento foi selecionado
    if (!paymentMethod) {
        alert('Por favor, selecione um método de pagamento.');
        return; // Se a validação falhar, não prossegue com o envio
    }

    const total = cart.reduce((acc, item) => acc + item.price, 0);
    const totalWithFee = document.getElementById('total-with-fee').textContent.replace('Total com Taxa: R$ ', '');
    const itemsDescription = cart.map(item => `${item.name} - R$ ${item.price.toFixed(2)}`).join('\n');
    const paymentMethodText = document.getElementById('payment-method').selectedOptions[0].text;

    const message = `Olá, segue os produtos escolhidos:\n\n${itemsDescription}\n\nTotal: R$ ${total.toFixed(2)}\nMétodo de Pagamento: ${paymentMethodText}\nTotal com Taxa: R$ ${totalWithFee}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${FIXED_PHONE_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
}

// Adiciona um listener ao método de pagamento para garantir a validação correta
document.getElementById('payment-method').addEventListener('change', updateTotalWithFee);
